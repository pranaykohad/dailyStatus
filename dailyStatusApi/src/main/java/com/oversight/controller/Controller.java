package com.oversight.controller;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.oversight.entity.Attachment;
import com.oversight.entity.Result;
import com.oversight.entity.Result.ResStatus;
import com.oversight.service.StatusService;
import com.oversight.service.UserService;
import com.oversight.entity.Status;
import com.oversight.entity.UserDTO;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class Controller {
	
	private static final Logger LOG = LoggerFactory.getLogger("controller.class");

	@Autowired
	UserService userService;

	@Autowired
	StatusService stsService;
	
	@PostMapping("/authnticate")
	public Result authnticateUser(@RequestBody final UserDTO user) {
		final Result result = new Result();
		final UserDTO resultUser = userService.autheticateUser(user.getUserName(), user.getPassword());
		if (resultUser != null) {
			result.setData(resultUser);
		} else {
			result.setDescription("Some error while Autheticating. Please contact Administratator.");
			result.setStatus(ResStatus.FAILURE);
			LOG.error("Some error while Autheticating. Please contact Administratator.");
		}
		return result;
	}
	
	@GetMapping("/report")
	public Result getUserByUserIdAndDate(@RequestParam final String userId, @RequestParam final String startDate, @RequestParam final String endDate) {
		final Result result = new Result();
		final List<Status> statusList = stsService.getUserByUserAndDate(userId, startDate, endDate);
		if (!statusList.isEmpty()) {
			StringBuilder dailyStatusFileContent = stsService.createDailyStatusReport("hello, I am pranay kohad");
			byte[] byteConent = dailyStatusFileContent.toString().getBytes();
			final Attachment attachment = new Attachment();
			attachment.setFileContent(byteConent);
			attachment.setFilename(LocalDate.now()+".txt");
			attachment.setMimeType("text/plain");
			result.setData(attachment);
		} else {
			result.setStatus(ResStatus.FAILURE);
			result.setDescription("Some error while getting status. Please contact Administratator.");
			LOG.error("Some error while getting status. Please contact Administratator.");
		}
		return result;
	}

	@PostMapping("/status")
	public Result saveUserStatus(@RequestBody final List<Status> statusList) {
		final Result result = new Result();
		List<Status> ressultList = stsService.saveStatus(statusList);
		if (!ressultList.isEmpty()) {
			result.setDescription("Status is saved successfully.");
			result.setStatus(ResStatus.FAILURE);
		} else {
			result.setDescription("Some error while saving status. Please contact Administratator.");
			result.setStatus(ResStatus.FAILURE);
			LOG.error("Some error while saving status. Please contact Administratator.");
		}
		return result;
	}

	@PostMapping("/update")
	public Result updateDetails(@RequestBody final UserDTO user) {
		final Result result = new Result();
		result.setData(userService.updateUserDetails(user));
		return result;
	}
}
