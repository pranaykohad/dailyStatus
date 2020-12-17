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
import org.springframework.web.bind.annotation.RestController;

import com.oversight.entity.Result;
import com.oversight.entity.Result.ResStatus;
import com.oversight.entity.User;
import com.oversight.service.UserService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class UserController {
	
	private static final Logger LOG = LoggerFactory.getLogger("UserController.class");

	@Autowired
	UserService userService;
	
	@PostMapping("/authenticate")
	public Result authnticateUser(@RequestBody final User user) {
		final Result result = new Result();
		final User resultUser = userService.autheticateUser(user.getUserName(), user.getPassword());
		if (resultUser != null) {
			result.setData(resultUser);
		} else {
			result.setDescription("Some error while Autheticating. Please contact Administratator.");
			result.setStatus(ResStatus.FAILURE);
			LOG.error("Some error while Autheticating. Please contact Administratator with user {}", user);
		}
		return result;
	}

	@PostMapping("/update")
	public Result updateDetails(@RequestBody final User user) {
		final Result result = new Result();
		result.setData(userService.updateUserDetails(user));
		return result;
	}
	
	@PostMapping("/user")
	public Result addUser(@RequestBody final User user) {
		final Result result = new Result();
		result.setData(userService.addUser(user));
		return result;
	}
	
	@GetMapping("/user")
	public Result getAllUser() {
		final Result result = new Result();
		List<User> userList = userService.getAllUser();
		if(userList.isEmpty()) {
			result.setStatus(ResStatus.FAILURE);
			result.setDescription("Failed to get User List. Please contact Admnistrator");
			LOG.error("Failed to get User List. Please contact Admnistrator.");
		} else {
			result.setData(userList);
		}
		return result;
	}
	
}
