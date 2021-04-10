package com.statushub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.statushub.entity.Leave;
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
		return leaveService.getLeavesByTypeAndMonth(type, month);
	}
	
	@PostMapping("/leaves")
	public Result addLeaves(@RequestBody final List<Leave> leaves) {
		return leaveService.addLeaves(leaves);
	}
	
	@DeleteMapping("/leaves")
	public Result deleteLeaves(@RequestParam() final List<Integer> leavesIds) {
		return leaveService.deleteLeaveById(leavesIds);
	}

}