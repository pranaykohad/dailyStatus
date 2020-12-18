package com.oversight.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.oversight.entity.Status;

@Repository
public interface StatusRepository extends JpaRepository<Status, Integer>{
	
	@Query(value="SELECT * FROM status s where s.user_user_id=?1 and s.d_date between ?2 and ?3 order by s.d_date", nativeQuery = true)
	public List<Status> getStatusByUserAndDateRange(String userId, String startDate, String endDate);
	
	@Query(value="SELECT s.* FROM status s JOIN user u ON s.user_user_id = u.user_id WHERE s.d_date = ?1 AND u.module_name = ?2 AND u.type = ?3 AND UPPER(s.state) = UPPER(?4);", nativeQuery = true)
	public List<Status> getStatusByDateModuleTypeAndState(String date, String module, String type, String state);

}
