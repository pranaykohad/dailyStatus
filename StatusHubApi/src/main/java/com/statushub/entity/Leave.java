package com.statushub.entity;

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
	private String start;
	@JsonIgnore
	private String type;
	
	@Transient
	private String updatedStart;
	
	@Transient
	private String title;
	
	@ManyToOne
	@JsonIgnore
	private User user;
	
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
	public String getUpdatedStart() {
		return updatedStart;
	}
	public void setUpdatedStart(String updatedStart) {
		this.updatedStart = updatedStart;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}

}
