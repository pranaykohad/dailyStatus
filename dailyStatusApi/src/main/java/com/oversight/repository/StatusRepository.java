package com.oversight.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.oversight.entity.Status;

@Repository
public interface StatusRepository extends JpaRepository<Status, Integer>{
	
	@Query(value="SELECT * FROM status s where s.user_user_id=?1 and s.date=?2", nativeQuery = true)
	public List<Status> getUserByUserAndDate(final String userId, final String date);
	

}
