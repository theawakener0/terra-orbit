import { tool } from "ai";
import { z } from "zod";

export const web_search = tool({});

export const web_find = tool({});

export const web_content = tool({});

export const web_answerer = tool({});

export const web_tools = {
    web_search,
    web_find,
    web_content,
    web_answerer,
};

