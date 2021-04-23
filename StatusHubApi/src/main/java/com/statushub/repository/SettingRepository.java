package com.statushub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.statushub.entity.Setting;

@Repository
public interface SettingRepository extends JpaRepository<Setting, Integer> {

	public Setting findByKey(final String key);

}
