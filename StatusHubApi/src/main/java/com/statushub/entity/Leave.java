package com.statushub.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="DLeave")
public class Leave {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int leaveId;
	private String title;
	private String start;
	private String updaedStart;
	
	public int getLeaveId() {
		return leaveId;
	}
	public void setLeaveId(int leaveId) {
		this.leaveId = leaveId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getStart() {
		return start;
	}
	public void setStart(String start) {
		this.start = start;
	}
	public String getUpdaedStart() {
		return updaedStart;
	}
	public void setUpdaedStart(String updaedStart) {
		this.updaedStart = updaedStart;
	}

}
