package com.statushub.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name="DLeave")
public class Leave {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int leaveId;
	private int date;
	private String type;
	private String day;
	@OneToOne
	private User user;
	
	public int getLeaveId() {
		return leaveId;
	}
	public void setLeaveId(int leaveId) {
		this.leaveId = leaveId;
	}
	public int getDate() {
		return date;
	}
	public void setDate(int date) {
		this.date = date;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getDay() {
		return day;
	}
	public void setDay(String day) {
		this.day = day;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}

}
