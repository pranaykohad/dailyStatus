package com.statushub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.statushub.entity.Leave;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Integer>{

	@Query(value = "SELECT * FROM dleave l WHERE l.day_type = ?1 AND l.start_date LIKE ?2", nativeQuery = true)
	public List<Leave> getHalfdayLeavesByMonth(final String dayType, final String month);

	int deleteLeaveByLeaveId(int leaveId);

	@Query(value = "SELECT COUNT(*) FROM dleave l WHERE l.user_user_id = ?1 AND l.day_type = ?2 AND l.start_date BETWEEN ?3 AND ?4 ORDER BY l.start_date", nativeQuery = true)
	public int getLeaveCountByTypeAndDate(final int userId, final String dayType, final String startDate, final String endDate);

	@Query(value = "SELECT l.* FROM dleave l JOIN duser u ON l.user_user_id = u.user_id WHERE l.type IN (:types) AND l.start_date BETWEEN :startDate AND :endDate ORDER BY l.start_date, u.first_name, u.last_name", nativeQuery = true)
	public List<Leave> getUserOnLeave(final @Param("startDate") String startDate, final @Param("endDate") String endDate, final @Param("types") List<String> types);

	@Query(value = "SELECT COUNT(*) FROM dleave l WHERE l.user_user_id = ?1 AND l.start_date = ?2 AND l.day_type = 'full-day' ORDER BY l.start_date", nativeQuery = true)
	public int getLeaveCountByDate(final int userId, final String date);
}
