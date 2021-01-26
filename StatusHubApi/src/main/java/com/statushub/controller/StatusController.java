package com.statushub.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

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

import com.statushub.entity.Result;
import com.statushub.entity.Result.ResStatus;
import com.statushub.entity.Status;
import com.statushub.service.StatusService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class StatusController {

	@Autowired
	StatusService stsService;

	@GetMapping("/report")
	public Result getReportByDate(@RequestParam final String date) {
		return stsService.createReport(date);
	}

	@GetMapping("/statusByDateAndUserId")
	public Result getYesterdayUpdate(@RequestParam
		final String date, @RequestParam
		final String userId) {
		return stsService.createReportByDateAndUserId(date, userId);
	}

	@GetMapping("/reportByUserAndDateRange")
	public Result getReportByUserAndDateRange(@RequestParam final Collection<? extends String> userIdList, @RequestParam final String startDate, 
		@RequestParam final String endDate, @RequestParam final String reportType) {
		final List<String> newUserIdList = new ArrayList<>();
		newUserIdList.addAll(userIdList);
		return stsService.createReport(newUserIdList, startDate, endDate, reportType);
	}

	@Transactional
	@PostMapping("/status")
	public Result updateStatus(@RequestBody @NonNull final List<Status> statusList) {
		final Result result = new Result();
		stsService.updateStatus(statusList);
		result.setStatus(ResStatus.SUCCESS);
		result.setDescription("Status saved successfully");
		return result;
	}

}
