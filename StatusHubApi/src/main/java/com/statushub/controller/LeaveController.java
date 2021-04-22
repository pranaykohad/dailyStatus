package com.statushub.controller;

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
import com.statushub.repository.LeaveRepository;
import com.statushub.service.LeaveService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class LeaveController {

	@Autowired
	LeaveService leaveService;

	@Autowired
	LeaveRepository leaveRepository;

	@GetMapping("/leave")
	public Result getHalfdayLeavesByMonth(@RequestParam() final String type, @RequestParam() final String month) {
		return leaveService.getLeavesByTypeAndMonth(type, month);
	}

	@PostMapping("/leave")
	public Result addLeaves(@RequestBody
		final Leave leave) {
		return leaveService.addLeaves(leave);
	}

	@DeleteMapping("/leave")
	public Result deleteLeaves(@RequestParam()
	final Integer leavesId) {
		return leaveService.deleteLeaveById(leavesId);
	}

	@GetMapping("/res-utilization-report")
	public Result buildResourceUtilizationReport(@RequestParam() final String startDate, @RequestParam() final String endDate, @RequestParam() final int dateCount) {
		return leaveService.buildResourceUtilizationReport(startDate, endDate, dateCount);
	}

	@GetMapping("/leave-report")
	public Result buildLeaveReport(@RequestParam()
	final String startDate, @RequestParam()
	final String endDate, @RequestParam(defaultValue = "All")
	final String type) {
		return leaveService.buildLeaveReport(startDate, endDate, type);
	}

}
