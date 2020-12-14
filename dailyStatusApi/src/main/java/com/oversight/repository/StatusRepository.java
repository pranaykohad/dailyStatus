package com.oversight.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.oversight.entity.Status;

@Repository
public interface StatusRepository extends JpaRepository<Status, Integer>{
	
	@Query(value="SELECT * FROM status s where s.user_user_id=?1 and s.date in (?2, ?3)", nativeQuery = true)
	public List<Status> getStatusByUserAndDateRange(String userId, String startDate, String endDate);
	
	@Query(value="SELECT * FROM status s where s.date = ?1", nativeQuery = true)
	public List<Status> getStateByDate(String date);

	
	@Query(value="SELECT s.* FROM status s JOIN user u ON s.user_user_id = u.user_id WHERE s.date = ?1 AND u.module_name = ?2 AND u.type = ?3 AND UPPER(s.state) = UPPER(?4);", nativeQuery = true)
	public List<Status> getStatus(String date, String module, String type, String state);

}
