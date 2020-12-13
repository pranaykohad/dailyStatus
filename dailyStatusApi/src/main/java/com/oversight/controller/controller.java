package com.oversight.controller;

import java.util.List;

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
public class controller {

	@Autowired
	UserService userService;

	@Autowired
	StatusService stsService;
	
	@GetMapping("/getStatus")
	public Result getUserByUserIdAndDate(@RequestParam final String userId, @RequestParam final String startDate, @RequestParam final String endDate) {
		final Result result = new Result();
		final List<Status> statusList = stsService.getUserByUserAndDate(userId, startDate, endDate);
		if (statusList.size() > 0) {
			result.setData(statusList);
		} else {
			result.setStatus(ResStatus.FAILURE);
			result.setDescrition("Some error while getting status. Please contact Administratator.");
			// add logger to print query
		}
		return result;
	}

	@PostMapping("/authnticateUser")
	public Result authnticateUser(@RequestBody final User user) {
		final Result result = new Result();
		final User resultUser = userService.autheticateUser(user.getUserName(), user.getPassword());
		if (resultUser != null) {
			result.setData(resultUser);
		} else {
			result.setDescrition("Some error while Autheticating. Please contact Administratator.");
			result.setStatus(ResStatus.FAILURE);
			// add logger to print query
		}
		return result;
	}

	@PostMapping("/saveStatus")
	public Result saveUserStatus(@RequestBody final List<Status> statusList) {
		final Result result = new Result();
		List<Status> ressultList = stsService.saveStatus(statusList);
		if (ressultList.size() > 0) {
			result.setDescrition("Status is saved successfully.");
			result.setStatus(ResStatus.FAILURE);
		} else {
			result.setDescrition("Some error while Autheticating. Please contact Administratator.");
			result.setStatus(ResStatus.FAILURE);
			// add logger to print query
		}
		return result;
	}

	@PostMapping("/updateDetails")
	public Result updateDetails(@RequestBody final User user) {
		final Result result = new Result();
		result.setData(userService.updateUserDetails(user));
		return result;
	}
}
