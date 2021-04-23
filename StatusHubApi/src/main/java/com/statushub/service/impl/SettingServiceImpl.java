package com.statushub.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.statushub.entity.Result;
import com.statushub.entity.Result.ResStatus;
import com.statushub.entity.Setting;
import com.statushub.repository.SettingRepository;
import com.statushub.service.SettingService;


@Service
public class SettingServiceImpl implements SettingService {

	private static final Logger LOG = LoggerFactory.getLogger("SettingServiceImpl.class");

	@Autowired
	SettingRepository settingRepository;

	@Override
	public Result getAllSettings() {
		final Result result = new Result();
		result.setStatus(ResStatus.SUCCESS);
		final List<Setting> settingList = settingRepository.findAll();
		LOG.debug("Setting list begins");
		settingList.forEach(item -> LOG.debug("{} : {}", item.getKey(), item.getValue()));
		LOG.debug("Setting list ends");
		result.setData(settingList);
		return result;
	}

	@Override
	public Result getSetting(final String key) {
		final Result result = new Result();
		result.setStatus(ResStatus.SUCCESS);
		final Setting settingObj = settingRepository.findByKey(key);
		LOG.debug("Get Setting Object {} : {}", settingObj.getKey(), settingObj.getValue());
		result.setData(settingRepository.findByKey(key));
		return result;
	}

	@Override
	public Result saveOrUpdateSetting(final Setting setting) {
		final Result result = new Result();
		result.setStatus(ResStatus.FAILURE);
		final Setting res = settingRepository.save(setting);
		LOG.debug("Saved Setting Object: {} : {}", res.getKey(), res.getValue());
		if (!res.getKey().isEmpty()) {
			result.setData(res);
			result.setStatus(ResStatus.SUCCESS);
		}
		return result;
	}

}
