package com.statushub.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.statushub.entity.Result;
import com.statushub.entity.User;
import com.statushub.entity.Result.ResStatus;
import com.statushub.service.UserService;

@CrossOrigin(origins = "*")
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
	
	@GetMapping("/user")
	public Result getUsersById(@RequestParam final int userId) {
		return userService.getUserById(userId);
	}
	
	@PutMapping("/user")
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

	@GetMapping("/user-by-type")
	public Result getUsersByUserType(@RequestParam(defaultValue = "All") final String userType) {
		final Result result = new Result();
		final List<User> userList = userService.getUsersByUserType(userType);
		result.setData(userList);
		return result;
	}
	
	@DeleteMapping("/user")
	public Result deleteUser(@RequestParam final String userId) {
		return userService.deleteUser(userId);
	}
	
	@GetMapping("/defaultersList")
	public Result getDefaultersList(@RequestParam
	final String date) {
		return userService.getDefaultersList(date);
	}
	
	@GetMapping("/customDefaulters")
	public Result getCustomDefaulters(@RequestParam
	final List<String> datesList) {
		return userService.getCustomDefaulters(datesList);
	}

}
