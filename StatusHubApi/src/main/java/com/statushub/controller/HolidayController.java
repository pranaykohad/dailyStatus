package com.statushub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.statushub.entity.Result;
import com.statushub.service.HolidayService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class HolidayController {

	@Autowired
	HolidayService holidayService;

	@GetMapping("/holidays")
	public Result getAllHolidays() {
		return holidayService.getAllHolidays();
	}

	
}
