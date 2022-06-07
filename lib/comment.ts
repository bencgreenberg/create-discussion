import * as core from "@actions/core";
import Resource from "./resource";

export class Comment extends Resource {
  body: string;
  id: string;
  constructor(
    readonly commentBody: string,
    readonly discussionId: string
  ) {
    super();
  }

  async load(): Promise<void> {
    throw new Error("Not implemented");
  }

  async update(): Promise<void> {
    throw new Error("Not implemented");
  }

  async save(): Promise<void> {
    type ResponseShape = {
      data: {
        addDiscussionComment: {
          discussion: {
            body: string;
            discussionId: string;
          };
        };
      };
    };

    const response = await this.graphql(
      `mutation AddDiscussionComment(
        $body: String!
        $discussionId: ID!
      ) {
        # input type: AddDiscussionCommentInput
        addDiscussionComment(
          input: {
            discussionId: $discussionId
            body: $body
          }
        ) {
          # response type: AddDiscussionCommentPayload
          comment {
            id
            url
          }
        }
      }
      `,
      {
        body: this.body,
        discussionId: this.discussionId,
      }
    );
    this.id = (response.data as ResponseShape).data.addDiscussionComment.discussion.discussionId;
    this.body = (response.data as ResponseShape).data.addDiscussionComment.discussion.body;

    this.debug(`Comment Created id: ${this.id}, body: ${this.body}`);
  }
}
