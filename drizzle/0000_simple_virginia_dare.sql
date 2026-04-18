CREATE TABLE `answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`qid` integer NOT NULL,
	`date_created` text DEFAULT (CURRENT_TIMESTAMP),
	`date_modified` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`qid`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`user_id` integer NOT NULL,
	`date_created` text DEFAULT (CURRENT_TIMESTAMP),
	`date_modified` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`avatar` text,
	`kind` text,
	`gender` text NOT NULL,
	`date_of_birth` text,
	`job` text,
	`handed` text,
	`left_palm_url` text,
	`right_palm_url` text,
	`date_created` text DEFAULT (CURRENT_TIMESTAMP),
	`date_modified` text DEFAULT (CURRENT_TIMESTAMP)
);
