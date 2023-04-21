package io.openvidu.call.java.controllers;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.openvidu.call.java.services.AuthService;
import io.openvidu.call.java.services.OpenViduService;
import io.openvidu.call.java.services.ProxyService;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Recording;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/recordings")
public class RecordingController {

	@Value("${CALL_RECORDING}")
	private String CALL_RECORDING;

	@Value("${OPENVIDU_URL}")
	private String OPENVIDU_URL;

	@Autowired
	private OpenViduService openviduService;

	@Autowired
	private AuthService authService;

	@Autowired
	private ProxyService proxyService;

	@GetMapping("")
	public ResponseEntity<?> getRecordings(
			@CookieValue(name = OpenViduService.MODERATOR_TOKEN_NAME, defaultValue = "") String moderatorToken,
			@CookieValue(name = AuthService.ADMIN_COOKIE_NAME, defaultValue = "") String adminToken) {
		try {
			List<Recording> recordings = new ArrayList<Recording>();
			boolean IS_RECORDING_ENABLED = CALL_RECORDING.toUpperCase().equals("ENABLED");
			String sessionId = openviduService.getSessionIdFromCookie(moderatorToken);
			boolean isAdminSessionValid = authService.isAdminSessionValid(adminToken);

			if ((!sessionId.isEmpty() && IS_RECORDING_ENABLED
					&& openviduService.isValidToken(sessionId, moderatorToken)) || isAdminSessionValid) {
				if (isAdminSessionValid) {
					recordings = this.openviduService.listAllRecordings();
				} else {
					long date = openviduService.getDateFromCookie(moderatorToken);
					recordings = openviduService.listRecordingsBySessionIdAndDate(sessionId, date);
				}
				return new ResponseEntity<>(recordings, HttpStatus.OK);
			} else {
				String message = IS_RECORDING_ENABLED ? "Permissions denied to drive recording"
						: "Recording is disabled";
				System.err.println(message);
				return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);

			}
		} catch (OpenViduJavaClientException | OpenViduHttpException error) {
			error.printStackTrace();
			int code = Integer.parseInt(error.getMessage());
			String message = "Unexpected error getting all recordings";
			if (code == 404) {
				message = "No recording exist for the session";
			}
			System.err.println(message);
			return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PostMapping("/start")
	public ResponseEntity<?> startRecording(@RequestBody(required = false) Map<String, String> params,
			@CookieValue(name = OpenViduService.MODERATOR_TOKEN_NAME, defaultValue = "") String moderatorToken) {

		try {
			String sessionId = params.get("sessionId");
			if (CALL_RECORDING.toUpperCase().equals("ENABLED")) {
				if (openviduService.isValidToken(sessionId, moderatorToken)) {
					Recording startingRecording = openviduService.startRecording(sessionId);
					openviduService.recordingMap.get(sessionId).setRecordingId(startingRecording.getId());
					System.out.println("Starting recording in " + sessionId);
					return new ResponseEntity<>(startingRecording, HttpStatus.OK);

				} else {
					String message = "Permissions denied for starting recording in session " + sessionId;
					System.out.println(message);
					return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
				}
			} else {
				String message = "Start recording failed. OpenVidu Call Recording is disabled";
				System.out.println(message);
				return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
			}

		} catch (OpenViduJavaClientException | OpenViduHttpException error) {
			error.printStackTrace();
			int code = Integer.parseInt(error.getMessage());
			String message = "Unexpected error starting recording";
			if (code == 409) {
				message = "The session is already being recorded.";
			} else if (code == 501) {
				message = "OpenVidu Server recording module is disabled";
			} else if (code == 406) {
				message = "The session has no connected participants";
			}
			System.err.println(message);
			return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);

		}

	}

	@PostMapping("/stop")
	public ResponseEntity<?> stopRecording(@RequestBody(required = false) Map<String, String> params,
			@CookieValue(name = OpenViduService.MODERATOR_TOKEN_NAME, defaultValue = "") String moderatorToken) {
		try {
			String sessionId = params.get("sessionId");
			if (CALL_RECORDING.toUpperCase().equals("ENABLED")) {
				if (openviduService.isValidToken(sessionId, moderatorToken)) {
					String recordingId = openviduService.recordingMap.get(sessionId).getRecordingId();

					if (!recordingId.isEmpty()) {
						System.out.println("Stopping recording in " + sessionId);
						openviduService.stopRecording(recordingId);
						long date = openviduService.getDateFromCookie(moderatorToken);
						List<Recording> recordingList = openviduService.listRecordingsBySessionIdAndDate(sessionId,
								date);
						openviduService.recordingMap.get(sessionId).setRecordingId("");
						return new ResponseEntity<>(recordingList, HttpStatus.OK);
					} else {
						String message = "Session was not being recorded";
						System.err.println(message);
						return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
					}
				} else {
					String message = "Permissions denied to drive recording";
					System.err.println(message);
					return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
				}
			} else {
				String message = "Stop recording failed. OpenVidu Call Recording is disabled";
				System.out.println(message);
				return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
			}

		} catch (OpenViduJavaClientException | OpenViduHttpException error) {
			error.printStackTrace();
			int code = Integer.parseInt(error.getMessage());
			String message = "Unexpected error stopping recording";
			if (code == 501) {
				message = "OpenVidu Server recording module is disabled";
			} else if (code == 406) {
				message = "Recording has STARTING status. Wait until STARTED status before stopping the recording";
			}
			System.err.println(message);
			return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/delete/{recordingId}")
	public ResponseEntity<?> deleteRecording(@PathVariable String recordingId,
			@CookieValue(name = OpenViduService.MODERATOR_TOKEN_NAME, defaultValue = "") String moderatorToken,
			@CookieValue(name = AuthService.ADMIN_COOKIE_NAME, defaultValue = "") String adminToken) {
		try {
			List<Recording> recordings = new ArrayList<Recording>();
			String sessionId = openviduService.getSessionIdFromCookie(moderatorToken);
			boolean isAdminSessionValid = authService.isAdminSessionValid(adminToken);

			if ((!sessionId.isEmpty() && openviduService.isValidToken(sessionId, moderatorToken))
					|| isAdminSessionValid) {
				if (recordingId.isEmpty()) {
					String message = "Missing recording id parameter.";
					System.err.println(message);
					return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
				}

				System.out.println("Deleting recording " + recordingId);
				openviduService.deleteRecording(recordingId);
				if (isAdminSessionValid) {
					recordings = openviduService.listAllRecordings();
				} else {
					long date = openviduService.getDateFromCookie(moderatorToken);
					recordings = openviduService.listRecordingsBySessionIdAndDate(sessionId, date);
				}
				return new ResponseEntity<>(recordings, HttpStatus.OK);

			} else {
				String message = "Permissions denied to drive recording";
				System.err.println(message);
				return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
			}
		} catch (OpenViduJavaClientException | OpenViduHttpException error) {
			error.printStackTrace();
			int code = Integer.parseInt(error.getMessage());
			String message = "Unexpected error deleting the recording";
			if (code == 409) {
				message = "The recording has STARTED status. Stop it before deletion.";
			} else if (code == 501) {
				message = "OpenVidu Server recording module is disabled";
			} else if (code == 409) {
				message = "No recording exists for the session";
			}
			System.err.println(message);
			return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/{recordingId}/{extension}")
	public ResponseEntity<?> getRecording(@PathVariable String recordingId, @PathVariable String extension,
			@CookieValue(name = OpenViduService.MODERATOR_TOKEN_NAME, defaultValue = "") String moderatorToken,
			@CookieValue(name = AuthService.ADMIN_COOKIE_NAME, defaultValue = "") String sessionToken,
			HttpServletRequest req,
			HttpServletResponse res) {

		boolean isAdminSessionValid = authService.isAdminSessionValid(sessionToken);
		String sessionId = this.openviduService.getSessionIdFromCookie(moderatorToken);
		if ((!sessionId.isEmpty() && openviduService.isValidToken(sessionId, moderatorToken))
				|| isAdminSessionValid) {
			if (recordingId.isEmpty()) {
				String message = "Missing recording id parameter.";
				System.err.println(message);
				return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
			} else {
				try {
					return proxyService.recordingProxyRequest(req, res);
				} catch (URISyntaxException e) {
					e.printStackTrace();
				}
				return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} else {
			String message = "Permissions denied to drive recording";
			System.err.println(message);
			return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
		}

	}

}
