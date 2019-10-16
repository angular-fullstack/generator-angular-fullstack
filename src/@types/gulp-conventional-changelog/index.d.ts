declare module 'gulp-conventional-changelog' {
  import ReadWriteStream = NodeJS.ReadWriteStream;

  export interface GulpConventionalChangelogOptions {
    preset?: 'angular'|'atom'|'codemirror'|'ember'|'eslint'|'express'|'jquery'|'jscs'|'jshint'|string;
    config?: {};
    pkg?: {
      path?: string;
      transform?: (packageJson: object) => object;
    };
    append?: boolean;
    releaseCount?: number;
    debug?: () => void;
    warn?: () => void;
    transform?: (commit: string, cb: Function) => void;
  }

  export interface Commit {
    scope: string;
    hash: string;
    subScope: boolean;
    leadScope: boolean;
    gitTags: string;
  }

  export interface Context {
    host?: string;
    version?: string;
    owner?: string;
    repository?: string;
    repoUrl?: string;
    gitSemverTags?: string[];
    previousTag?: string|null;
    currentTag?: string|null;
    packageData?: {};
    linkCompare?: boolean;
    commitGroups?: Array<{commits: Commit[]}>
  }

  export interface GitRawCommitsOptions {}

  export interface ConventionalCommitsParserOptions {}

  export interface ConventionalChangelogWriterOptions {
    finalizeContext?: FinalizeContext;
    commitPartial?: string;
  }

  export type FinalizeContext = (context: Context, opts: GulpConventionalChangelogOptions, commits: Commit[], keyCommit: Commit) => Context;

  export default function conventionalChangelog(
    options: GulpConventionalChangelogOptions,
    context: Context,
    gitRawCommitsOptions: GitRawCommitsOptions,
    conventionalCommitsParserOptions: ConventionalCommitsParserOptions,
    conventionalChangelogWriterOptions: ConventionalChangelogWriterOptions): ReadWriteStream;
}
