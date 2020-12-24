package com.oversight.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;
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
import com.oversight.service.StatusService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class StatusController {

	private static final Logger LOG = LoggerFactory.getLogger("StatusController.class");

	@Autowired
	StatusService stsService;

	@GetMapping("/report")
	public Result getReportByDate(@RequestParam final String date) {
		return stsService.createReport(date);
	}

	@GetMapping("/recentStatus")
	public Result getYesterdayUpdate(@RequestParam
		final String date, @RequestParam
		final String userId) {
		return stsService.createReportByDateAndUserId(date, userId);
	}

	@GetMapping("/reportByUserAndDateRange")
	public Result getReportByUserAndDateRange(@RequestParam final String userId, @RequestParam final String startDate, 
		@RequestParam final String endDate, @RequestParam final String reportType) {
		return stsService.createReport(userId, startDate, endDate, reportType);
	}

	@Transactional
	@PostMapping("/status")
	public Result saveUserStatus(@RequestBody @NonNull final List<Status> statusList) {
		final Result result = new Result();
		final List<Status> ressultList = stsService.saveStatus(statusList);
		if (!ressultList.isEmpty()) {
			result.setDescription("Status is saved successfully.");
		} else {
			result.setDescription("Some error while saving status. Please contact Administratator.");
			result.setStatus(ResStatus.FAILURE);
			LOG.error("Some error while saving status. Please contact Administratator with statuslist {}", statusList);
		}
		return result;
	}

}
