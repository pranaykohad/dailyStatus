package com.statushub.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Dsetting")
public class Setting {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int settingId;

	private String key;

	private String value;

	public int getSettingId() {
		return settingId;
	}

	public String getKey() {
		return key;
	}

	public void setKey(final String key) {
		this.key = key;
	}

	public String getValue() {
		return value;
	}

	public void setValue(final String value) {
		this.value = value;
	}

}
