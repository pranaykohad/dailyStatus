package com.statushub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.statushub.entity.Holiday;

@Repository
public interface HolidayRepository extends JpaRepository<Holiday, Integer> {
	
	@Query(value = "SELECT COUNT(*) FROM dholiday h WHERE h.start_date BETWEEN ?1 AND ?2", nativeQuery = true)
	public int getHolidayCount(final String startDate, final String endDate);
	
	public Holiday findByStart(final String date);
	
}
