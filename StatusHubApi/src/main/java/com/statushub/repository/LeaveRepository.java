package com.statushub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.statushub.entity.Leave;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Integer>{
	
	@Query(value = "INSERT INTO dleave", nativeQuery = true)
	public void addLeave(Leave leave);
	
	@Query(value = "SELECT * FROM dleave l WHERE l.type=?1 AND l.start LIKE ?2", nativeQuery = true)
	public List<Leave> getHalfdayLeavesByMonth(String type, String month);

}
