import { TestBed } from "@angular/core/testing"
import { CoursesService } from "./courses.service"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { COURSES } from "../../../../server/db-data"

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
    afterEach(() => {
        httpTestingController.verify()
    })
})