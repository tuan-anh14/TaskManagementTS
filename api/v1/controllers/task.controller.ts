import { Router, Request, Response } from "express";

import Task from "../models/task.model";
import paginationHelper from "../../../helpers/pagination";

export const index = async (req: Request, res: Response) => {
  // Find
  interface Find {
    deleted: boolean;
    status?: string;
  }

  const find: Find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status.toString();
  }
  // End Find

  //Pagination
  let initPagination = {
    currentPage: 1,
    limitItems: 2,
  };

    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countTasks
    );

  //End Pagination

  // Sort
  const sort: { [key: string]: any } = {};

  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey.toString();
    sort[sortKey] = req.query.sortValue;
  }

  // End Sort

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems);

  res.json(tasks);
};

export const detail = async (req: Request, res: Response) => {
  const id = req.params.id;

  const task = await Task.findOne({
    _id: id,
    deleted: false,
  });

  res.json(task);
};
