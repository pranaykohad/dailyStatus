package com.statushub.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="DHoliday")
public class Holiday {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int holidayId;
	private String title;

	@Column(name = "startDate")
	private String start;

	public int getHolidayId() {
		return holidayId;
	}
	public void setHolidayId(final int holidayId) {
		this.holidayId = holidayId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(final String title) {
		this.title = title;
	}
	public String getStart() {
		return start;
	}
	public void setStart(final String start) {
		this.start = start;
	}
}
