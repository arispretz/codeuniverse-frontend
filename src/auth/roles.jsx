/**
 * @fileoverview Defines user roles within the CodeUniverse platform.
 * These roles are used for access control and permission management
 * across different modules of the application.
 *
 * @module auth/roles
 */

/**
 * Enumeration of user roles available in the platform.
 * Each role determines the level of access and permissions granted.
 *
 * @readonly
 * @enum {string}
 */
export const Roles = {
  /** 
   * Developer role.
   * Can contribute code, manage personal tasks, and collaborate on projects.
   */
  DEVELOPER: 'developer',

  /** 
   * Manager role.
   * Can oversee projects, assign tasks, and monitor team progress.
   */
  MANAGER: 'manager',

  /** 
   * AI Assistant role.
   * System-generated assistant that provides code suggestions and automation.
   */
  AI_ASSISTANT: 'ai_assistant',

  /** 
   * Admin role.
   * Full access to all platform features, including user and project management.
   */
  ADMIN: 'admin',

  /** 
   * Guest role.
   * Limited access, typically read-only for viewing projects and tasks.
   */
  GUEST: 'guest'
};
