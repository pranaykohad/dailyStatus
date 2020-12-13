package com.oversight.controller;

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

import com.oversight.entity.Result;
import com.oversight.entity.Result.ResStatus;
import com.oversight.entity.Status;
import com.oversight.entity.User;
import com.oversight.serviceInt.StatusService;
import com.oversight.serviceInt.UserService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class Controller {
	
	Logger LOG = LoggerFactory.getLogger("controller.class");

	@Autowired
	UserService userService;

	@Autowired
	StatusService stsService;
	
	@PostMapping("/authnticate")
	public Result authnticateUser(@RequestBody final User user) {
		final Result result = new Result();
		final User resultUser = userService.autheticateUser(user.getUserName(), user.getPassword());
		if (resultUser != null) {
			result.setData(resultUser);
		} else {
			result.setDescrition("Some error while Autheticating. Please contact Administratator.");
			result.setStatus(ResStatus.FAILURE);
			LOG.error("Some error while Autheticating. Please contact Administratator.");
		}
		return result;
	}
	
	@GetMapping("/status")
	public Result getUserByUserIdAndDate(@RequestParam final String userId, @RequestParam final String startDate, @RequestParam final String endDate) {
		final Result result = new Result();
		final List<Status> statusList = stsService.getUserByUserAndDate(userId, startDate, endDate);
		if (statusList.size() > 0) {
			result.setData(statusList);
		} else {
			result.setStatus(ResStatus.FAILURE);
			result.setDescrition("Some error while getting status. Please contact Administratator.");
			LOG.error("Some error while getting status. Please contact Administratator.");
		}
		return result;
	}

	@PostMapping("/status")
	public Result saveUserStatus(@RequestBody final List<Status> statusList) {
		final Result result = new Result();
		List<Status> ressultList = stsService.saveStatus(statusList);
		if (ressultList.size() > 0) {
			result.setDescrition("Status is saved successfully.");
			result.setStatus(ResStatus.FAILURE);
		} else {
			result.setDescrition("Some error while saving status. Please contact Administratator.");
			result.setStatus(ResStatus.FAILURE);
			LOG.error("Some error while saving status. Please contact Administratator.");
		}
		return result;
	}

	@PostMapping("/update")
	public Result updateDetails(@RequestBody final User user) {
		final Result result = new Result();
		result.setData(userService.updateUserDetails(user));
		return result;
	}
}
