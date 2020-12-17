package com.oversight.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.oversight.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{
	
	public User getUserByUserNameAndPassword(String userName, String password);
	
	@Query(value="SELECT * FROM user u where u.user_id = ?1", nativeQuery = true)
	public User getUserByUserId(String userId);

}
