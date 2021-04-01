package com.statushub.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="Duser")
public class User {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int userId;
	private String userName;
	private String password;
	private String moduleName;
	private String type;
	private String role;
	private String firstName;
	private String lastName;
	private String roleLabel;
	private Boolean billable;
	private Long baseHours;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Status> statusList;
	@Transient 
	private int defCount;


	public Long getBaseHours() {
		return baseHours;
	}

	public void setBaseHours(final Long baseHours) {
		this.baseHours = baseHours;
	}
	public int getDefCount() {
		return defCount;
	}
	public void setDefCount(final int defCount) {
		this.defCount = defCount;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(final String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(final String lastName) {
		this.lastName = lastName;
	}
	public String getType() {
		return type;
	}
	public void setType(final String type) {
		this.type = type;
	}
	public String getRole() {
		return role;
	}
	public void setRole(final String role) {
		this.role = role;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(final int userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(final String userName) {
		this.userName = userName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(final String password) {
		this.password = password;
	}
	public String getModuleName() {
		return moduleName;
	}
	public void setModuleName(final String moduleName) {
		this.moduleName = moduleName;
	}
	public List<Status> getStatusList() {
		return statusList;
	}
	public void setStatusList(final List<Status> statusList) {
		this.statusList = statusList;
	}
	public String getRoleLabel() {
		return roleLabel;
	}
	public void setRoleLabel(final String roleLabel) {
		this.roleLabel = roleLabel;
	}

	public Boolean getBillable() {
		return billable;
	}

	public void setBillable(final Boolean billable) {
		this.billable = billable;
	}

}
