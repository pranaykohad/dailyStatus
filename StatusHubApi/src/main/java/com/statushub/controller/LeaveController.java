package com.statushub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.statushub.entity.Result;
import com.statushub.service.LeaveService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class LeaveController {

	@Autowired
	LeaveService leaveService;

	@GetMapping("/leaves")
	public Result getHalfdayLeavesByMonth(@RequestParam() final String type, @RequestParam() final String month) {
		return leaveService.getHalfdayLeavesByMonth(type, month);
	}

}
