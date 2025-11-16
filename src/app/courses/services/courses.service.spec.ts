import { COURSES, findLessonsForCourse } from './../../../../server/db-data';
import { TestBed } from "@angular/core/testing"
import { CoursesService } from "./courses.service"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { Course } from "../model/course"
import { HttpErrorResponse } from '@angular/common/http';

describe('CourseService', () => {
    let coursesService: CoursesService,
        httpTestingController: HttpTestingController
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                CoursesService
            ]
        })
        coursesService = TestBed.inject(CoursesService)
        httpTestingController = TestBed.inject(HttpTestingController)
    })
    it('should return all courses', () => {
        console.log(2);

        coursesService.findAllCourses()
            .subscribe(courses => {
                expect(courses).toBeTruthy('No Courses returned')
                expect(courses.length).toBe(12, 'incorrect number of courses')
                const course = courses.find(r => r.id == 12)
                expect(course.titles.description).toBe("Angular Testing Course")
            })
        const req = httpTestingController.expectOne('/api/courses')
        expect(req.request.method).toEqual('GET');
        req.flush({ payload: Object.values(COURSES) })
    })
    it('should return all courses by id', () => {
        coursesService.findCourseById(12)
            .subscribe(courses => {
                expect(courses).toBeTruthy('No Courses returned')
                expect(courses.id).toBe(12, 'incorrect course found')
            })
        const req = httpTestingController.expectOne('/api/courses/12')
        expect(req.request.method).toBe('GET');
        expect(req.request.method).toEqual('GET');
        req.flush(COURSES?.[12])
    })
    it('should save the course by id', () => {
        const changes: Partial<Course> = {
            titles: {
                description: 'test1'
            }
        }
        coursesService.saveCourse(12, changes)
            .subscribe(r => {
                expect(r.id).toEqual(12);
            })
        const req = httpTestingController.expectOne('/api/courses/12')
        expect(req.request.method).toBe('PUT');
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body.titles.description).toEqual(changes.titles.description);
        req.flush({
            ...COURSES[12],
            ...changes
        })
    })
    it('should give error if save course fails', () => {
        const changes: Partial<Course> = {
            titles: {
                description: 'test1'
            }
        }
        coursesService.saveCourse(12, changes)
            .subscribe
            (
                (r) => fail('save course intentionally failed'),
                (error: HttpErrorResponse) => {
                    expect(error.status).toBe(500);
                }
            )
        const req = httpTestingController.expectOne('/api/courses/12')
        expect(req.request.method).toBe('PUT');
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body.titles.description).toEqual(changes.titles.description);
        req.flush('Save Course failed', { status: 500, statusText: 'Internal Server Error' })
    })
    it('should return data by findLessons method', () => {
        coursesService.findLessons(12)
            .subscribe(r => {
                expect(r).toBeTruthy();
                expect(r.length).toBe(3);
            })
        const req = httpTestingController.expectOne(
            res => res.url == '/api/lessons'
        )
        expect(req.request.method).toBe('GET');
        expect(req.request.method).toEqual('GET');
        expect(req.request.params.get('courseId')).toBe('12');
        expect(req.request.params.get('filter')).toBe('');
        expect(req.request.params.get('sortOrder')).toBe('asc');
        expect(req.request.params.get('pageNumber')).toBe('0');
        expect(req.request.params.get('pageSize')).toBe('3');
        req.flush({
            payload: findLessonsForCourse(12).slice(0, 3)
        })
    })
    afterEach(() => {
        httpTestingController.verify()
    })
})