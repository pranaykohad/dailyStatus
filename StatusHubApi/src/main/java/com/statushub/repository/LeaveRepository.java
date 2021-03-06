package com.statushub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.statushub.entity.Leave;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Integer>{
	
	@Query(value = "insert into dleave",nativeQuery = true)
	public void addLeave(Leave leave);

}
