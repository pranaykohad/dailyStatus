package com.oversight.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oversight.entity.Result;
import com.oversight.entity.Status;
import com.oversight.entity.User;
import com.oversight.serviceInt.UserService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class controller {
	@Autowired
	UserService userService;
	
	@PostMapping("/authnticateUser")
	public Result authnticateUser(@RequestBody final User user) {
		final Result result = new Result();
		final User usr = userService.autheticateUser(user.getUserName(), user.getPassword());
//		if(usr !=null) {
//			usr.setPassword(null);
//		}
		result.setData(usr);
		return result;
	}
	
	
	@PostMapping("/saveStatus")
	public Result saveUserStatus(@RequestBody final List<Status> statusList) {
		final Result result = new Result();
		return result;
	}
	
	@GetMapping("/user/{userId}")
	public Result getUserByUserId(@PathVariable final int userId) {
		final Result result = new Result();
		final User user = userService.getUserByUserId(userId);		
		result.setData(user);
		return result;
	}
	
	
}

