package com.satya.cert.service;

import com.satya.cert.entity.Course;
import com.satya.cert.repository.CourseRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Cacheable("courses")
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Cacheable(value = "courseById", key = "#id")
    public Course getCourseById(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
    }

    @Cacheable("publishedCourses")
    public List<Course> getPublishedCourses() {
        return courseRepository.findByPublishedTrue();
    }

    @CacheEvict(value = {"courses", "publishedCourses"}, allEntries = true)
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    @CacheEvict(value = {"courses", "publishedCourses", "courseById"}, allEntries = true)
    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        course.setName(courseDetails.getName());
        course.setPrice(courseDetails.getPrice());
        course.setDuration(courseDetails.getDuration());
        if (courseDetails.getPublished() != null) {
            course.setPublished(courseDetails.getPublished());
        }
        return courseRepository.save(course);
    }

    @CacheEvict(value = {"courses", "publishedCourses", "courseById"}, allEntries = true)
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        courseRepository.delete(course);
    }

    @CacheEvict(value = {"courses", "publishedCourses", "courseById"}, allEntries = true)
    public Course publishCourse(Long id, boolean published) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        course.setPublished(published);
        return courseRepository.save(course);
    }
}
