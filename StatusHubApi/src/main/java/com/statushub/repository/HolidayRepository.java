package com.statushub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.statushub.entity.Holiday;

@Repository
public interface HolidayRepository extends JpaRepository<Holiday, Integer>{
	

}
