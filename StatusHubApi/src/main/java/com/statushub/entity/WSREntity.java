package com.statushub.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name="WSREntity")
public class WSREntity {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int wsrId;
	private String baseHours;
	private String hoildayHours;
	private String leaveHours;
	private String avilableHours;
	private String actualHours;
	private String utilization;
	
	@OneToOne
	private User user;

	public int getWsrId() {
		return wsrId;
	}
	public void setWsrId(int wsrId) {
		this.wsrId = wsrId;
	}
	public String getBaseHours() {
		return baseHours;
	}
	public void setBaseHours(String baseHours) {
		this.baseHours = baseHours;
	}
	public String getHoildayHours() {
		return hoildayHours;
	}
	public void setHoildayHours(String hoildayHours) {
		this.hoildayHours = hoildayHours;
	}
	public String getLeaveHours() {
		return leaveHours;
	}
	public void setLeaveHours(String leaveHours) {
		this.leaveHours = leaveHours;
	}
	public String getAvilableHours() {
		return avilableHours;
	}
	public void setAvilableHours(String avilableHours) {
		this.avilableHours = avilableHours;
	}
	public String getActualHours() {
		return actualHours;
	}
	public void setActualHours(String actualHours) {
		this.actualHours = actualHours;
	}
	public String getUtilization() {
		return utilization;
	}
	public void setUtilization(String utilization) {
		this.utilization = utilization;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}

}
