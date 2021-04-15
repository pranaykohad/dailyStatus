package com.statushub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.statushub.entity.Leave;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Integer>{

	@Query(value = "SELECT * FROM dleave l WHERE l.type = ?1 AND l.start_date LIKE ?2", nativeQuery = true)
	public List<Leave> getHalfdayLeavesByMonth(final String type, final String month);
	
	int deleteLeaveByLeaveId(int leaveId);
	
	@Query(value = "SELECT COUNT(*) FROM dleave l WHERE l.user_user_id = ?1 AND l.type = ?2 AND l.start_date BETWEEN ?3 AND ?4 ORDER BY l.start_date", nativeQuery = true)
	public int getLeaveCount(final int userId, final String type, final String startDate, final String endDate);
	
	@Query(value = "SELECT l.* FROM dleave l JOIN duser u WHERE l.user_user_id = u.user_id AND l.start_date BETWEEN ?1 AND ?2 ORDER BY l.start_date, u.first_name, u.last_name", nativeQuery = true)
	public List<Leave> getUserOnLeave(final String startDate, final String endDate);

}
