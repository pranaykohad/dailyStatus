package com.statushub.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name="Leave")
public class Leave {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int leaveId;
	private String date;
	private String pLeave;
	private String hLeave;
	private String day;
	
	@OneToOne
	private User user;

	public int getLeaveId() {
		return leaveId;
	}
	public void setLeaveId(int leaveId) {
		this.leaveId = leaveId;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getpLeave() {
		return pLeave;
	}
	public void setpLeave(String pLeave) {
		this.pLeave = pLeave;
	}
	public String gethLeave() {
		return hLeave;
	}
	public void sethLeave(String hLeave) {
		this.hLeave = hLeave;
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
