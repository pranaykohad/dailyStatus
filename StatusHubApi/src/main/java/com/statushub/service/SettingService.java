package com.statushub.service;

import java.util.List;

import com.statushub.entity.Result;
import com.statushub.entity.Setting;

public interface SettingService {

	public Result getAllSettings();

	public Result getSetting(final String key);

	public Result saveOrUpdateSetting(final List<Setting> setting);
}
