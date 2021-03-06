package com.statushub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.statushub.entity.WSREntity;

@Repository
public interface WSRRepository extends JpaRepository<WSREntity, Integer>{
	

}
