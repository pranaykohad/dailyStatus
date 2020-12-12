package com.oversight.entity;

public class Result {
	
	public enum Status {
		SUCCESS,
		FAILURE
	}
	
	private Status status = Status.SUCCESS;
	private String descrition;
	private Object data;
	
	public Status getStatus() {
		return status;
	}
	public void setStatus(Status status) {
		this.status = status;
	}
	public String getDescrition() {
		return descrition;
	}
	public void setDescrition(String descrition) {
		this.descrition = descrition;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	
}
