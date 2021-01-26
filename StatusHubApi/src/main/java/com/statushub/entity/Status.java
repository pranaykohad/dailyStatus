package com.statushub.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name="Dstatus")
public class Status {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int statusId;
	private String ticketId;
	private String description;
	private String state;
	private String dDate;
	@Transient 
	private boolean isDelete;
	
	@ManyToOne
	private User user;

	public int getStatusId() {
		return statusId;
	}
	public void setStatusId(final int statusId) {
		this.statusId = statusId;
	}
	public String getTicketId() {
		return ticketId;
	}
	public void setTicketId(final String ticketId) {
		this.ticketId = ticketId;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(final String description) {
		this.description = description;
	}
	public String getState() {
		return state;
	}
	public void setState(final String state) {
		this.state = state;
	}
	public String getdDate() {
		return dDate;
	}
	public void setdDate(final String dDate) {
		this.dDate = dDate;
	}
	public User getUser() {
		return user;
	}
	public void setUser(final User user) {
		this.user = user;
	}
	public boolean isDelete() {
		return isDelete;
	}
	public void setDelete(boolean isDelete) {
		this.isDelete = isDelete;
	}
	
}
