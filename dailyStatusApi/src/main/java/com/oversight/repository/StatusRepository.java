package com.oversight.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oversight.entity.Status;

@Repository
public interface StatusRepository extends JpaRepository<Status, Integer>{
	

}
