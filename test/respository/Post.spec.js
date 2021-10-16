'use strict';
const expect = require('chai').expect;

const PostRepo = require('../../server/repository/Post');
const _ = require('lodash');
const nock = require('nock');

const mockPostsTech = require('../mockData/posts_tech.json'); //https://api.hatchways.io/assessment/blog/posts?tag=tech
const mockPostsHistory = require('../mockData/posts_history.json'); //https://api.hatchways.io/assessment/blog/posts?tag=history
const mockPostsScience = require('../mockData/posts_science.json'); //https://api.hatchways.io/assessment/blog/posts?tag=science
const mockPostsDesign = require('../mockData/posts_design.json'); //https://api.hatchways.io/assessment/blog/posts?tag=deisign


suite('Testing Post Repository', () => {
    suite('async fetchPost(tag)', () => {
        test('should return post for the "tech" tag correctly', async () => {
            const postRepo = new PostRepo();
            const tag = 'tech';
            nock(postRepo.HOST)
                .get(postRepo.PATH)
                .query(new URLSearchParams(`tag=${tag}`))
                .reply(200, mockPostsTech); // Not found!.
            const result = await postRepo.fetchPost(tag);
            expect(result).to.be.an('array').that.have.lengthOf(28);
            expect(_.keys(result[0])).to.be.deep.equal(['author', 'authorId', 'id', 'likes', 'popularity', 'reads', 'tags'])
            expect(result[0].tags).to.be.deep.equal(['tech', 'health'])

            nock.cleanAll();
        });

        test('should return Error for the wrong tag', async () => {
            const postRepo = new PostRepo();
            try {
                await postRepo.fetchPost('')
                expect(1).to.be.equal(2);
            } catch (e) {
                expect(e.message).to.be.equal('Post:fetchPost()')
            }
        });
    });

    suite('async getPosts()', () => {
        test('should return Error for the wrong tag parameter', async () => {
            const postRepo = new PostRepo();
            try {
                await postRepo.getPosts('', {})
                expect(1).to.be.equal(2);
            } catch (e) {
                expect(e.message).to.be.equal('Tags parameter is required')
            }
            try {
                await postRepo.getPosts([], {})
                expect(1).to.be.equal(2);
            } catch (e) {
                expect(e.message).to.be.equal('Tags parameter is required')
            }
        });

        test('should return Error for the wrong sort parameters', async () => {
            const postRepo = new PostRepo();
            try {
                await postRepo.getPosts(['tech'], {
                    direction: 'left'
                })
                expect(1).to.be.equal(2);
            } catch (e) {
                expect(e.message).to.be.equal('sortBy parameter is invalid')
            }

            try {
                await postRepo.getPosts(['tech', 'health'], {
                    sortBy: 'price'
                })
                expect(1).to.be.equal(2);
            } catch (e) {
                expect(e.message).to.be.equal('sortBy parameter is invalid')
            }

            try {
                await postRepo.getPosts(['tech', 'health'], {
                    sortBy: 35
                })
                expect(1).to.be.equal(2);
            } catch (e) {
                expect(e.message).to.be.equal('sortBy parameter is invalid')
            }

        });
    });


});
