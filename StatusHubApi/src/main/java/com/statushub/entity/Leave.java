package com.statushub.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="DLeave")
public class Leave {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int leaveId;

	@Column(name = "startDate")
	private String start;

	@JsonIgnore
	private String dayType;

	@Transient
	private String updatedStart;

	@Transient
	private String title;

	private String type;

	@ManyToOne
	@JsonIgnore
	private User user;

	public int getLeaveId() {
		return leaveId;
	}
	public void setLeaveId(final int leaveId) {
		this.leaveId = leaveId;
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
	public String getUpdatedStart() {
		return updatedStart;
	}
	public void setUpdatedStart(final String updatedStart) {
		this.updatedStart = updatedStart;
	}
	public String getDayType() {
		return dayType;
	}
	public void setDayType(final String dayType) {
		this.dayType = dayType;
	}
	public User getUser() {
		return user;
	}
	public void setUser(final User user) {
		this.user = user;
	}

	public String getType() {
		return type;
	}

	public void setType(final String type) {
		this.type = type;
	}

}
