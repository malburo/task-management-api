import express from 'express';
import searchController from './search.controller';
const SearchRouter = express.Router();

SearchRouter.route('/users').get(searchController.searchUser);
SearchRouter.route('/:boardId/members').get(searchController.searchNewMember);

export default SearchRouter;
