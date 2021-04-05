package com.statushub.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.statushub.entity.Holiday;
import com.statushub.repository.HolidayRepository;
import com.statushub.service.HolidayService;

@Service
public class HolidayServiceImpl implements HolidayService {

	@Autowired
	HolidayRepository holidayRepository;

	@Override
	public List<Holiday> getAllHolidays() {
		final List<Holiday> holidays = holidayRepository.findAll();
		buildTitle(holidays);
		return holidays;
	}

	private void buildTitle(final List<Holiday> holidays) {
		holidays.forEach(Holiday -> {
			Holiday.setTitle(Holiday.getTitle() + ":holiday");
		});
	}

}
