package com.statushub.service.impl;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.statushub.entity.Holiday;
import com.statushub.entity.Result;
import com.statushub.entity.Result.ResStatus;
import com.statushub.repository.HolidayRepository;
import com.statushub.service.HolidayService;

@Service
public class HolidayServiceImpl implements HolidayService {

	@Autowired
	HolidayRepository holidayRepository;

	@Override
	public Result getAllHolidays() {
		final Result result = new Result();
		result.setStatus(ResStatus.FAILURE);
		final List<Holiday> holidays = holidayRepository.findAll();
		if(!holidays.isEmpty()) {
			final List<Holiday> finalHolidays = buildTitle(holidays);
			result.setData(finalHolidays);
			result.setStatus(ResStatus.SUCCESS);
		}
		return result;
	}

	private List<Holiday> buildTitle(final List<Holiday> holidays) {
		final List<Holiday> tempList = new CopyOnWriteArrayList<>(holidays);
		tempList.forEach(holiday -> {
			holiday.setTitle(holiday.getTitle() + ":holiday");
		});
		return tempList;
	}

}
