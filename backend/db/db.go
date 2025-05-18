package db

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

func InitDB(ctx context.Context, dbURL string) (*pgxpool.Pool, error) {
	dbPool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		return nil, fmt.Errorf("unable to create connection pool: %v", err)
	}

	if err := dbPool.Ping(ctx); err != nil {
		return nil, fmt.Errorf("unable to connect to database: %v", err)
	}

	return dbPool, nil
}
